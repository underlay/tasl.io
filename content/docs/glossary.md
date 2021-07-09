# glossary

Talking about schemas can be particularly challenging because so many terms (like "type" or even "term") are often overloaded with multiple meanings on different levels.

To minimize confusion, the tasl documentation uses a consistent and opinionated vocabulary.

### **namespace**

A _namespace_ is a vocabulary of _terms_. Namespaces don't have a concrete representation or specification; they're an entirely informal abstract resource.

[schema.org](https://schema.org/) is an example of a namespace.

### **namespace URI**

Namespaces are identified with a _namespace URI_, which is a URI that ends in an empty path segment `/` or an empty fragment `#`. Since namespaces are an abstract resource with no concrete representation, the namespace URI serves no purpose other than

`http://schema.org/` is the namespace URI for the [schema.org](https://schema.org/) namespace.

### **term**

A _term_ is an individual name in a namespace. Terms are URIs that begin with the namespace URI, and have one or more additional nonempty path segments or a nonempty fragment.

[`http://schema.org/Person`](https://schema.org/Person) is a term in the [schema.org](https://schema.org/) namespace.

### **kind**

Since "type" has a specific meaning in tasl, we prefer to use "kind" when referring casually to different types of things. For example, rather than saying "there are five types of types in tasl", we instead say "tasl has five different kinds of types". This is unrelated to the formal concept of [kinds in type theory](<https://en.wikipedia.org/wiki/Kind_(type_theory)>).

### **schema**

A _schema_ is a set of classes.

### **schema language**

### **binary format**

### **class**

### **type**

### **instance**

An _instance_ of a schema

### **element**

Elements intuitively correspond to "rows" in the relation data model.

### **value**

### **product**

A [product type](https://en.wikipedia.org/wiki/Product_type). Intuitively, a product type represents a combination of its constituent types (called _components_).

### **component**

A product type is composed of zero or more entries called _components_. A component has a URI key and a type, and is written as `(key) -> (type)`. Component keys within a product must be unique.

### **coproduct**

A [sum type](https://en.wikipedia.org/wiki/Tagged_union). Intuitively, a coproduct type represents a choice between its contituent types (called _options_).

"Sum type", "variant", "discriminated union", and "tagged union" are all common names for coproducts; we prefer "coproduct" because it's unambiguous to say out loud (unlike "sum type", which can be misunderstood as "some type"), it avoids confusion with untagged union types, and emphasizes its duality with products.

### **option**

A coproduct type is composed of zero or more entries called _options_. An option has a URI key and a type, and is written as `(key) <- (type)`. Option keys within a coproduct must be unique.
