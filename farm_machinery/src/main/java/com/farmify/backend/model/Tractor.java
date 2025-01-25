package com.farmify.backend.model;

import jakarta.persistence.Entity;

@Entity
public class Tractor extends Machinery {
    private int horsePower;
    private boolean fourWheelDrive;

    
    public int getHorsePower() {
        return horsePower;
    }

    public void setHorsePower(int horsePower) {
        this.horsePower = horsePower;
    }

    public boolean isFourWheelDrive() {
        return fourWheelDrive;
    }

    public void setFourWheelDrive(boolean fourWheelDrive) {
        this.fourWheelDrive = fourWheelDrive;
    }
    
}