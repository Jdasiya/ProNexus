package com.paf.pronexusbackend.Repository;

import com.paf.pronexusbackend.model.Connection;
import com.paf.pronexusbackend.model.ConnectionStatus;
import com.paf.pronexusbackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConnectionRepository extends JpaRepository<Connection, Integer> {
    Optional<Connection> findBySenderAndReceiver(User sender, User receiver);
    
    List<Connection> findByReceiverAndStatus(User receiver, ConnectionStatus status);
    
    List<Connection> findBySenderAndStatus(User sender, ConnectionStatus status);
    
    @Query("SELECT c FROM Connection c WHERE (c.sender = ?1 OR c.receiver = ?1) AND c.status = 'ACCEPTED'")
    List<Connection> findAllConnections(User user);
    
    boolean existsBySenderAndReceiverAndStatus(User sender, User receiver, ConnectionStatus status);
} 