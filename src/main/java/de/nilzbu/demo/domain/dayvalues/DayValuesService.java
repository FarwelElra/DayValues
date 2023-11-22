package de.nilzbu.demo.domain.dayvalues;

import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class DayValuesService {

    private DayValuesRepository repository;

    public List<DayValues> getAll() {
        return repository.findAll();
    }

    @PreAuthorize("USER")
    public void add(DayValueDto dayValueDto) {
        DayValues dayValue = new DayValues();
        dayValue.setId(UUID.randomUUID());
        dayValue.setDate(dayValueDto.getDate());
        dayValue.setSys(dayValueDto.getSys());
        dayValue.setDia(dayValueDto.getDia());
        dayValue.setPulse(dayValueDto.getPulse());
        dayValue.setWeight(dayValueDto.getWeight());
        repository.save(dayValue);
    }

    public void delete(List<DayValues> dayValues) {
        repository.deleteAll(dayValues);
    }
}
