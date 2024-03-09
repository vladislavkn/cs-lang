# CS-Lang

Simple online interpreter for _Goto_ langiuage. Feel free to open issues or make forks/PR.

## Spec

### Variable definition

- Variable's name must startr with at least one letter. It can include only letters and numbers.
- Variable's value must be a number greater or equal zero.

```
x = 1
```

### Addition/substraction

- Only one can be substracted or added to a variable
- If variable equals to zero, expression `variable - 1` will still return 0 (rule of the Goto language)

```
x = x + 1
x = x - 1
```

### Unconditional goto

- If line number is lower than 1, it will be interpreted as 1
- If line number is greater than number of lines, it will be interpreted as the maximum line number.

```
goto 42
```

### Confitional goto

- Rules of the unconditional goto are applied
- Condition can only check that variable is equal to zero

```
goto 42 if x = 0
```

### Halt

- Programs stops once `halt` is encountered.

```
halt
```

### Comments

- Comments starts with `#`

```
# What is the answer of life, the universe and everything?
```

_Enjoy!_
