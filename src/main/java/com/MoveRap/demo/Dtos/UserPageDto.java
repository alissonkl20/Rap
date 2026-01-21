package com.MoveRap.demo.Dtos;

public class UserPageDto {
    private String biography;
    private String profileImageUrl;
    private String backgroundImageUrl;
    private String musicUrls;
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