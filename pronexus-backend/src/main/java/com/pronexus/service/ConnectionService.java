package com.pronexus.service;

import com.pronexus.entity.Connection;
import com.pronexus.entity.ConnectionStatus;
import com.paf.pronexusbackend.model.User;
import com.paf.pronexusbackend.Repository.UserRepository;
import com.pronexus.repository.ConnectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ConnectionService {

    @Autowired
    private ConnectionRepository connectionRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Connection sendConnectionRequest(Integer senderId, Integer receiverId) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        if (connectionRepository.existsBySenderAndReceiverAndStatus(sender, receiver, ConnectionStatus.ACCEPTED)) {
            throw new RuntimeException("Connection already exists");
        }

        Connection connection = new Connection();
        connection.setSender(sender);
        connection.setReceiver(receiver);
        connection.setStatus(ConnectionStatus.PENDING);
        
        return connectionRepository.save(connection);
    }

    @Transactional
    public Connection acceptConnectionRequest(Integer connectionId) {
        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new RuntimeException("Connection request not found"));
        
        connection.setStatus(ConnectionStatus.ACCEPTED);
        return connectionRepository.save(connection);
    }

    @Transactional
    public Connection rejectConnectionRequest(Integer connectionId) {
        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new RuntimeException("Connection request not found"));
        
        connection.setStatus(ConnectionStatus.REJECTED);
        return connectionRepository.save(connection);
    }

    public List<User> getPendingRequests(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return connectionRepository.findByReceiverAndStatus(user, ConnectionStatus.PENDING)
                .stream()
                .map(Connection::getSender)
                .collect(Collectors.toList());
    }

    public List<User> getConnections(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return connectionRepository.findAllConnections(user)
                .stream()
                .map(connection -> 
                    connection.getSender().getId().equals(userId) ? 
                    connection.getReceiver() : connection.getSender()
                )
                .collect(Collectors.toList());
    }

    public boolean areConnected(Integer user1Id, Integer user2Id) {
        User user1 = userRepository.findById(user1Id)
                .orElseThrow(() -> new RuntimeException("User 1 not found"));
        User user2 = userRepository.findById(user2Id)
                .orElseThrow(() -> new RuntimeException("User 2 not found"));
        
        return connectionRepository.existsBySenderAndReceiverAndStatus(user1, user2, ConnectionStatus.ACCEPTED) ||
               connectionRepository.existsBySenderAndReceiverAndStatus(user2, user1, ConnectionStatus.ACCEPTED);
    }
} 