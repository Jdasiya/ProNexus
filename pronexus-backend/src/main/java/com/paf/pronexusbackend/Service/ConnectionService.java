package com.paf.pronexusbackend.Service;

import com.paf.pronexusbackend.model.Connection;
import com.paf.pronexusbackend.model.ConnectionStatus;
import com.paf.pronexusbackend.model.User;
import com.paf.pronexusbackend.Repository.ConnectionRepository;
import com.paf.pronexusbackend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

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
    public void rejectConnectionRequest(Integer connectionId) {
        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new RuntimeException("Connection request not found"));
        
        connectionRepository.delete(connection);
    }

    @Transactional
    public void removeConnection(Integer user1Id, Integer user2Id) {
        User user1 = userRepository.findById(user1Id)
                .orElseThrow(() -> new RuntimeException("User 1 not found"));
        User user2 = userRepository.findById(user2Id)
                .orElseThrow(() -> new RuntimeException("User 2 not found"));

        Optional<Connection> connection1 = connectionRepository.findBySenderAndReceiver(user1, user2);
        Optional<Connection> connection2 = connectionRepository.findBySenderAndReceiver(user2, user1);

        if (connection1.isPresent()) {
            connectionRepository.delete(connection1.get());
        } else if (connection2.isPresent()) {
            connectionRepository.delete(connection2.get());
        } else {
            throw new RuntimeException("No connection found between users");
        }
    }

    public List<Map<String, Object>> getPendingRequests(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return connectionRepository.findByReceiverAndStatus(user, ConnectionStatus.PENDING)
                .stream()
                .map(connection -> {
                    Map<String, Object> userMap = new HashMap<>();
                    User sender = connection.getSender();
                    userMap.put("id", sender.getId());
                    userMap.put("username", sender.getUsername());
                    userMap.put("userData", sender.getUserData());
                    userMap.put("connectionId", connection.getId());
                    return userMap;
                })
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getConnections(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return connectionRepository.findAllConnections(user)
                .stream()
                .map(connection -> {
                    Map<String, Object> userMap = new HashMap<>();
                    User connectedUser = connection.getSender().getId().equals(userId) ? 
                        connection.getReceiver() : connection.getSender();
                    userMap.put("id", connectedUser.getId());
                    userMap.put("username", connectedUser.getUsername());
                    userMap.put("userData", connectedUser.getUserData());
                    userMap.put("connectionId", connection.getId());
                    return userMap;
                })
                .collect(Collectors.toList());
    }

    public String getConnectionStatus(Integer user1Id, Integer user2Id) {
        User user1 = userRepository.findById(user1Id)
                .orElseThrow(() -> new RuntimeException("User 1 not found"));
        User user2 = userRepository.findById(user2Id)
                .orElseThrow(() -> new RuntimeException("User 2 not found"));
        
        Optional<Connection> connection1 = connectionRepository.findBySenderAndReceiver(user1, user2);
        Optional<Connection> connection2 = connectionRepository.findBySenderAndReceiver(user2, user1);
        
        if (connection1.isPresent()) {
            return connection1.get().getStatus().toString();
        }
        if (connection2.isPresent()) {
            return connection2.get().getStatus().toString();
        }
        
        return "NONE";
    }
} 