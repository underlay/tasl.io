# style guide

### **prefer the XSD datatypes**

Use the globally-defined XSD datatypes as much as you can; don't reach for custom literals unless you really need them.

### **minimize string literals**

If your strings are _identifiers_ that have a URI format, use the URI primitive type instead. Or, if your strings just encode values from a fixed set of options, you should use enums instead. In general, unless your strings feel like _arbitrary text_, you should try to tease out as much of their structure into the type level as possible.

### **minimize boolean literals**

If the two states of a boolean have natural names in a namespace, consider replacing them with a binary enum instead.

For example, rewriting

```tasl
namespace ex http://example.com/

class ex:IssueTicket :: {
  ex:closed -> boolean
}
```

into

```
namespace ex http://example.com/

class ex:IssueTicket :: {
  ex:status -> [
    ex:open
    ex:closed
  ]
}
```

is much clearer.

### **use JSON as an escape hatch**

If you have data that is semi-structured, inconsistent, heterogenous, or too awkward to model well with tasl (e.g. an array of numbers where the order is significant), use the `JSON` literal type as an escape hatch.

### **rethink arrays and lists**

One of the most noticeable things about tasl is that there is not array or list type. This might feel natural by comparison to relational databases, or unnatural by comparison to binary serialization formats like Protobuf.

If you're struggling to model lists or arrays in tasl, ask yourself these questions (in order of importance)

1. Is the order really significant? If you're really just modelling a _set_ of values, you should use a multi-valued property structure.
2. _What_ about the order is significant? If important information can be expressed as a value, consider just adding that explicitly to a multi-valued property - for example, adding an explicit `ex:index -> nonNegativeInteger` component to a multi-valued property class.
3. If the important thing about the order is the relationship between an entry and the _next_ entry, consider modeling a linked list using descriptive, context-specific names for the head and tail components of the list class.
4. If all else fails, consider treating the array like a singular value using the JSON type. This means you won't be able to model any structure inside the array.
