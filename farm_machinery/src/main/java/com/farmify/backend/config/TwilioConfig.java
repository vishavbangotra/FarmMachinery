package com.farmify.backend.config;

import com.twilio.Twilio;
import javax.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TwilioConfig {

    @Value("${twilio.accountSid}")
    private String accountSid;

    @Value("${twilio.authToken}")
    private String authToken;


    @PostConstruct
    public void init() {
        Twilio.init(accountSid, authToken);
    }
}
