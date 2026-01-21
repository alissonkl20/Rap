package com.MoveRap.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "user_page", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id")
})
public class UserPage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserModel user;
    
    @PreRemove
    private void preRemove() {
        user = null;
    }
    private String biography;
    private String profileImageUrl;
    private String backgroundImageUrl;
    private String musicUrls;
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public UserModel getUser() {
        return user;
    }
    public void setUser(UserModel user) {
        this.user = user;
    }
    public String getBiography() {
        return biography;
    }
    public void setBiography(String biography) {
        this.biography = biography;
    }
    public String getProfileImageUrl() {
        return profileImageUrl;
    }
    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }
    public String getBackgroundImageUrl() {
        return backgroundImageUrl;
    }
    public void setBackgroundImageUrl(String backgroundImageUrl) {
        this.backgroundImageUrl = backgroundImageUrl;
    }
    public String getMusicUrls() {
        return musicUrls;
    }
    public void setMusicUrls(String musicUrls) {
        this.musicUrls = musicUrls;
    }
}