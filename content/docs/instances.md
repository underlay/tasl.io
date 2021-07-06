# instances

![](/images/instance.png)

## classes, types, elements, and values

You can think of classes as types that are given URI labels - the whole schema is just a map from URIs to types.

## instances

Each kind of type corresponds to its own kind of _value_.

The class-vs-type distinction is mirrored on the instance side with _elements_, which instantiate classes, and _values_, which instantiate types. A collection version has a set of elements for each class in the schema; each element of a given class is associated with a value of the class type.

The important thing to remember is that _identity_ is held by **elements**. This means that you can have as many different elements of the same class as you want, even if they all have the "same" value. But by default, there's no externally-accessible way of identifying individual elements - they don't automatically have UUIDs or anything.
