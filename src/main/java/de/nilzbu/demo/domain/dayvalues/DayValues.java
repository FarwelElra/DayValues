package de.nilzbu.demo.domain.dayvalues;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Date;
import java.util.UUID;

@Entity
@Getter
@Setter
public class DayValues {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private UUID id;

    private Date date;
    private int sys;
    private int dia;
    private int pulse;
    private double weight;
}
