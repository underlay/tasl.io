# instances

A schema describes the shape, layout, and relationships of a dataset. What about the data itself?

A tasl _instance_ is a dataset. We call them instances to highlight that they're always instances **of** a particular schema. You can't have an instance by itself (if you did, you wouldn't be able to parse it).

## schema level vs instance level

We also use the words "schema" and "instance" in a more casual sense to refer to the two levels. Every part of a schema has a corresponding part in an instance of that schema.

```
| schema level | instance level |
| ------------ | -------------- |
| schema       | instance       |
| class        | element        |
| type         | value          |
```

### instances instantiate schemas

An instance is always an instance of a particular schema. The schema is data describing the shapes and layout in the dataset; the instance is the data populating those shapes.

### elements instantiate classes

An instance of a schema has, for each class, a set of _elements_. If classes are like tables in a relational database, then elements are like the rows in each table.

### values instantiate types

Each kind of type corresponds to its own kind of _value_. Every class in a schema has a specific type, and every element in an instance has a _value_ of the corresponding type.

![](/images/instance.png)

An important thing to remember is that identity is held by **elements**. This means that you can have as many different elements of the same class as you want, even if they all have the "same" value. But by default, there's no externally-accessible way of identifying individual elements - they don't automatically have UUIDs or anything.
