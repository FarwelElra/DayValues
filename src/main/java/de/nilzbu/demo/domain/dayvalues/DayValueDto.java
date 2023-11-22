package de.nilzbu.demo.domain.dayvalues;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class DayValueDto {
    private Date date;
    private int sys;
    private int dia;
    private int pulse;
    private double weight;
}
