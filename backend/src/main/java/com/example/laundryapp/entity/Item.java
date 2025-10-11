package com.example.laundryapp.entity;

import jakarta.persistence.*;

@Entity
public class Item {

    public enum ItemName {
        QUAN_DUI,
        QUAN_DAI,
        DO_LOT,
        AO_PHAO,
        AO_NGAN_TAY,
        AO_DAI_TAY,
        CHAN,
        DO_DUNG_KHAC
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private ItemName name;

    private int quantity;

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ItemName getName() {
        return name;
    }

    public void setName(ItemName name) {
        this.name = name;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
