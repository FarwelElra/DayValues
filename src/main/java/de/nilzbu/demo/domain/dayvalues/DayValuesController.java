package de.nilzbu.demo.domain.dayvalues;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/dayValues")
@AllArgsConstructor
public class DayValuesController {

    private DayValuesService dayValuesService;

    @GetMapping("/all")
    public ResponseEntity<List<DayValues>> getAllDayValues() {
        return ResponseEntity.ok(dayValuesService.getAll());
    }

    @PostMapping("/add")
    public ResponseEntity<Boolean> addNewDayValue(@RequestBody DayValueDto requestBody) {
        dayValuesService.add(requestBody);
        return ResponseEntity.ok(true);
    }

    @PostMapping("/delete")
    public ResponseEntity<Boolean> addNewDayValue(@RequestBody DayValues[] requestBody) {
        dayValuesService.delete(Arrays.stream(requestBody).toList());
        return ResponseEntity.ok(true);
    }

}
