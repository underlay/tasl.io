# schemas

A tasl _schema_ defines a set of _classes_. Each class has _key_ and a _type_. A key is a term from a namespace, and a _type_ is one of five kinds of types:

- a [literal type](/docs/literals)
- the [URI type](/docs/uris)
- a [product type](/docs/products)
- a [coproduct type](/docs/coproducts)
- a [reference type](/docs/references)

Two of these - products and coproducts - are composite, meaning they're composed of other types. Literals, URIs, and references are all primitive types

![a digram of a schema including two classes, a composite type, and a reference type](/images/schema.png)

In tasl, we declare classes using the `class` keyword, followed by its key and a type expression. Here, we declare a class with a key `ex:Thing` and a type `{}`.

```tasl
namespace ex http://example.com/

class ex:Thing :: {}
```

Other classes can have more complex types:

```tasl
namespace ex http://example.com/

class ex:Person :: {
  ex:name -> string
  ex:bestFriend -> ? * ex:Person
  ex:favoriteColor -> [
    ex:red
    ex:green
  ]
}
```
