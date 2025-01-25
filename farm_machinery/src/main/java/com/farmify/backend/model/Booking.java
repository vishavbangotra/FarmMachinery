package com.farmify.backend.model;

import jakarta.persistence.*;
import java.sql.Date;
import java.util.List;

@Entity
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Machine associated with the booking
    @ManyToOne
    @JoinColumn(name = "machine_id", nullable = false)
    private Machinery machine;

    // Owner of the machine
    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    // Customer making the booking request
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    // Start and end dates for the booking
    @Column(nullable = false)
    private Date startDate;

    @Column(nullable = false)
    private Date endDate;

    // Status of the booking
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status;

    // List of owners notified for the request
    @ManyToMany
    @JoinTable(name = "booking_requested_owners", joinColumns = @JoinColumn(name = "booking_id"), inverseJoinColumns = @JoinColumn(name = "owner_id"))
    private List<User> requestedOwners;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Machinery getMachine() {
        return machine;
    }

    public void setMachine(Machinery machine) {
        this.machine = machine;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public User getCustomer() {
        return customer;
    }

    public void setCustomer(User customer) {
        this.customer = customer;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public List<User> getRequestedOwners() {
        return requestedOwners;
    }

    public void setRequestedOwners(List<User> requestedOwners) {
        this.requestedOwners = requestedOwners;
    }
}
