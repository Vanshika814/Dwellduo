package com.dwellduo.config;

import com.dwellduo.entity.User;
import org.springframework.messaging.simp.user.DestinationUserNameProvider;

import java.security.Principal;

/**
 * Principal used for WebSocket sessions so that Spring's user-destination
 * resolution uses user ID (not email). This ensures convertAndSendToUser(userId, ...)
 * delivers to the correct session for both sender and receiver.
 */
public record StompUserPrincipal(User user) implements Principal, DestinationUserNameProvider {

    @Override
    public String getName() {
        return (user != null && user.getId() != null) ? user.getId().toString() : "";
    }

    @Override
    public String getDestinationUserName() {
        return (user != null && user.getId() != null) ? user.getId().toString() : "";
    }
}
