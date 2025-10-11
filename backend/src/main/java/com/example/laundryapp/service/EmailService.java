package com.example.laundryapp.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendSimpleMail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("huhuh8918@gmail.com"); // email người gửi
        message.setTo(to); // email người nhận
        message.setSubject(subject); // tiêu đề
        message.setText(text); // nội dung

        mailSender.send(message);
    }

    public void notifyOrderComplete(String userEmail, Long id) {
        String subject = "Đơn hàng #" + id + " của bạn đã hoàn tất";
        String body = "Cảm ơn bạn đã sử dụng dịch vụ giặt ủi của chúng tôi!\n"
                + "Đơn hàng " + id + " đã hoàn tất và sẵn sàng giao.";

        sendSimpleMail(userEmail, subject, body);
    }
}
