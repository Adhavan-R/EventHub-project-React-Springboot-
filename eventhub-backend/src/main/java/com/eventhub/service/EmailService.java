package com.eventhub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String toEmail, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("myprojectchatbot12@gmail.com");
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }

    public void sendEventCancelledEmail(String toEmail, String eventTitle) {
        String subject = "Event Cancelled: " + eventTitle;
        String body = "We're sorry to inform you that the event you RSVPed to — \"" + eventTitle + "\" — has been cancelled by the organizer or admin.";

        sendEmail(toEmail, subject, body);
    }


}
