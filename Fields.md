# Fields Data

This shows how we want to regenerate fields data for the application.


## Fields Data to be generated

```
{
    id: id preceded by 'field-', 
    name: name e.g. 'North Field', 
    usage: One of the preselected usages see below,
    sizeAcres: size in acres to 1 dp, 
    sizeHectares: size in hectares to 1dp, 
    soilType: One of preselected soil types see below, 
    drainage: One of drainage statuses see below,
    currentCrop: Match usage for now, 
    livestock: always null, 
    lastWorked: date of last activity,
    description: Generated description based on above information,
    mapPosition: 
        { top: int value, 
          left: int value, 
          width: int value, 
          height: int value },
    activities: [ add between 1-5 for each field
        { 
            id: id preceded by 'a-', 
            date: date, 
            title: generated title e.g. 'Fertiliser Application', 
            details: generated details, 
            user: User from list of users
        },
    ],
  }
```

**Note**: Category has been changed to usage. This shoudl be updated where applicable. Usage is associated with a crop at the moment so currentCrop should reflect this.

**Usages**: Wheat, Barley, Maize, Oats, Grass, Potatoes, Oilseed rape

**SoilTypes**: Sandy, Clay, Loam, Silt, Peat, Chalk

**Drainage**: Very Poor, Poor, Fair, Good, Very Good
