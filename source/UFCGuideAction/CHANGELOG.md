# Change Log

## Version 1.1 - dev

- ADD: Add `Region` checking. this will add `setOnlyRegion` and `setExceptRegion` method
- ADD: Add `type`, default for type is `default`. To set type of terrain use `setType`

```js
this.setType("trap").setOnlyTerrain([3]); // This will set terrain for type ""trap"" to 3

this.setType("tower").setOnlyTerrain([1, 2]); // This will set terrain for type ""tower"" to 1,2

this.setType("trap"); // Change current type to ""trap""
this.checkGrid(1, 1); // So now when checking grid this only checking for ""trap"" type
```

- CHANGE: Change placement Guide action data outside $gameplayer, because of the saving system

## Version 1.0

- First Release
