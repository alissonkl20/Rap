package com.MoveRap.demo.Dtos;

import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.ArrayList;
import com.fasterxml.jackson.annotation.JsonProperty;

public class UserPageDto {
    
    @Size(max = 1000, message = "A biografia não pode ter mais de 1000 caracteres")
    private String biography;
    
    private String profileImageUrl;
    private String backgroundImageUrl;
    
    // Mantido para compatibilidade, mas deprecated
    @Deprecated
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String musicUrls;
    
    // Novo campo para lista de músicas
    private List<String> musicUrlsList;
    
    public UserPageDto() {
        this.musicUrlsList = new ArrayList<>();
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
    @Deprecated
    public String getMusicUrls() {
        if (musicUrlsList != null && !musicUrlsList.isEmpty()) {
            return String.join(",", musicUrlsList);
        }
        return musicUrls;
    }
    @Deprecated
    public void setMusicUrls(String musicUrls) {
        this.musicUrls = musicUrls;
        // Converte string para lista
        if (musicUrls != null && !musicUrls.isEmpty()) {
            this.musicUrlsList = List.of(musicUrls.split(","));
        }
    }
    public List<String> getMusicUrlsList() {
        return musicUrlsList;
    }
    public void setMusicUrlsList(List<String> musicUrlsList) {
        this.musicUrlsList = musicUrlsList;
    }
}