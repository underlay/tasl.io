# glossary

Talking about schemas can be particularly challenging because so many terms (like "type" or even "term") are often overloaded with multiple meanings on different levels.

To minimize confusion, the tasl documentation uses a consistent and opinionated vocabulary.

### **namespace**

A _namespace_ is a vocabulary of URI _terms_. Namespaces don't have a concrete representation or specification; they're an entirely informal abstract resource.

[schema.org](https://schema.org/) is an example of a namespace.

### **namespace URI**

Namespaces are identified with a _namespace URI_, which is a URI that ends in an empty path segment `/` or an empty fragment `#`. Namespace URIs are the common "prefix" part of the terms in the namespace.

`http://schema.org/` is the namespace URI for the [schema.org](https://schema.org/) namespace.

### **term**

A _term_ is an individual name in a namespace. Terms are URIs that begin with the namespace URI, and have one or more additional nonempty path segments or a nonempty fragment.

[`http://schema.org/Person`](https://schema.org/Person) is a term in the [schema.org](https://schema.org/) namespace.

### **kind**

Since "type" has a specific meaning in tasl, we prefer to use "kind" when referring casually to different types of things. For example, rather than saying "there are five types of types in tasl", we instead say "tasl has five different kinds of types". This is unrelated to the formal concept of [kinds in type theory](<https://en.wikipedia.org/wiki/Kind_(type_theory)>).

### **schema**

A _schema_ is a set of classes. You can equivalently think of a schema as a map from URI terms to types.

### **class**

A _class_ is one of the top-level entries in a schema. A class has a key and a type.

### **type**

A _type_ is one of five kinds of types: [literal](/docs/literals), [URI](/docs/uris), [product](/docs/products), [coproduct](/docs/coproduct), or [reference](/docs/references). Types in tasl are classic [algebraic data types](https://en.wikipedia.org/wiki/Algebraic_data_type) augmented with a special reference type.

### **instance**

An _instance_ of a schema is a set of elements for each of the schema's classes, where each element has a value of the corresponding class's type.

### **element**

Elements intuitively correspond to "rows" in the relational data model. An instance of a schema has a set of elements for each of the schema's classes, and each element of a class has a value of that class's type.

### **value**

Each of the five kinds of types are instantiated by a corresponding kind of value. For example, the literal type `integer` is instantiated by integer values `"-1"`, "`1004`", etc, the URI type is instantiated by URI values like `urn:isbn:0-486-27557-4`, and so on. and

### **product**

A [product type](https://en.wikipedia.org/wiki/Product_type). Intuitively, a product type represents a combination of its constituent types (called _components_). A value of a product type is tuple with one value for each of its components

### **component**

A product type is composed of zero or more entries called _components_. A component has a URI key and a type, and is written as `(key) -> (type)`. Component keys within a product must be unique.

### **coproduct**

A [sum type](https://en.wikipedia.org/wiki/Tagged_union). Intuitively, a coproduct type represents a choice between its constituent types (called _options_). A value of a coproduct type is a tuple `(key, value)` where `key` is one of the type's option keys, and `value` is a value for that option's type

"Sum type", "variant", "discriminated union", and "tagged union" are all common names for coproducts; we prefer "coproduct" because it's unambiguous to say out loud (unlike "sum type", which can be misunderstood as "some type"), it avoids confusion with untagged union types, and emphasizes its duality with products.

### **option**

A coproduct type is composed of zero or more entries called _options_. An option has a URI key and a type, and is written as `(key) <- (type)`. Option keys within a coproduct must be unique.

### **reference**

Reference types point to a specific class in the schema; a value of a reference type is a pointer to an individual element of the referenced class.

Reference types are analogous to foreign key constraints in a relational database.
