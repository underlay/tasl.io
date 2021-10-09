# instance format

tasl instances can be serialized to binary files, canonically given the `.instance` file extension.

Instances and schemas are always represented separately - a `.instance` file does not contain the schema for the instance. In other words, given in-memory representation types `Schema` and `Instance`, serialization is always a function of two arguments:

```typescript
declare function serialize<S extends Schema>(
	schema: S,
	instance: Instance<S>
): Buffer
```

... and parsing is also always a function of two arguments:

```typescript
declare function parse<S extends Schema>(schema: S, data: Buffer): Instance<S>
```

Schemas can be stored and parsed from text schema language files (`.tasl`), or stored as serialized instances of the canonical _schema schema_. Instances of the schema schema are canonically given the file extension `.schema`, and all tasl library implementations should be able to parse them.

## version number

`.instance` files begin with a single unsigned varint indicating the serialization version number; the serialized version described on this page is version `1` (`0x01`).

## elements

After the version number, the contents of each class are serialized in lexicographic order of the class key URI. The class key URIs, since they are known from the schema, do not appear in the `.instance` file. For example, given this schema:

```tasl
namespace ex http://example.com/

class ex:Foo <>

class ex:Bar <>
```

... the elements in class `ex:Bar` would be serialized first, followed by the elements in `ex:Foo`.

Each serialized class begins with an unsigned varint encoding the total number of elements in the class (which may be zero). After this, each element is serialized consecutively; there are no delimiters between elements or between classes.

## values

Elements have no explicit identity or header; they are simply represented by serializing their value. Since the schema is known in advance, there is no need to represent the types of each value in the instance serialization, since they are known from the schema.

### URIs

URI values begin with an unsigned varint encoding the length in bytes of the URI, followed by the bytes URI itself.

### literals

Since the datatype of the literal type is known from the schema, only the value needs to be serialized.

The tasl `.instance` format can serialize values of arbitrary datatypes, since all values are represented (by definition) as UTF-8 strings. Values are serialized with a uvarint length prefix followed by the raw bytes of the value.

**However** the tasl binary format has special cases for the following XSD datatypes:

```
| XSD datatype             | width (bytes) | serialization                                     |
| ------------------------ | ------------- | ------------------------------------------------- |
| `xsd:boolean`            | 1             | `1` for true or `0` for false                     |
| `xsd:double`             | 4             | IEEE float64                                      |
| `xsd:float`              | 2             | IEEE float32                                      |
| `xsd:integer`            | variable      | signed varint                                     |
| `xsd:nonNegativeInteger` | variable      | unsigned varint                                   |
| `xsd:long`               | 8             | int64                                             |
| `xsd:int`                | 4             | int32                                             |
| `xsd:short`              | 2             | int16                                             |
| `xsd:byte`               | 1             | int8                                              |
| `xsd:unsignedLong`       | 8             | uint64                                            |
| `xsd:unsignedInt`        | 4             | uint32                                            |
| `xsd:unsignedShort`      | 2             | uint16                                            |
| `xsd:unsignedByte`       | 1             | uint8                                             |
| `xsd:hexBinary`          | variable      | a uvarint length prefix followed by the raw bytes |
```

As per the XSD spec, `xsd:integer` and `xsd:nonNegativeInteger` values can be arbitrarily large. Unsigned varints use the [Protobuf](https://developers.google.com/protocol-buffers/docs/encoding#varints) / Golang [`encoding/binary`](https://pkg.go.dev/encoding/binary) encoding scheme, only without the 10-byte maximum limit. A signed varint `n` is represented as an unsigned varint: `2n` if `0 <= n` and `-2n - 1` if `n < 0`.

Note that `xsd:positiveInteger`, `xsd:nonPositiveInteger`, and `negativeInteger` do not have special encodings.

### products

Since the product components, their keys, and their values are all known in advance from the schema, a product value is serialized by serializing its component values by lexicographic order of their keys.

For example, in this schema

```tasl
namespace ex http://example.com/

class ex:Widget {
  ex:spinniness -> float64
  ex:deluxe -> boolean
}
```

each `ex:Widget` element would be serialized by nine bytes wide - first the `ex:deluxe` component, whose value (`boolean`) would take a fixed single byte, and then the `ex:deluxe` component, whose value (`float64`) would take a fixed eight bytes.

### coproducts

Again, the coproduct options, their keys, and their values are all known in advance from the schema. A serialized coproduct value begins with an unsigned varint encoding the _index_ of the value's option, as sorted lexicographically by key, followed by the serialization of the option value.

In other words, when decoding a coproduct value, the coproduct options are first sorted lexicographically, and then an unsigned varint is read to index into the sorted array. A value of the corresponding option's type immediately follows.

### references

Element references are represented by unsigned varints encoding indices of elements as they appear in the serialization.

These indices are **only** for use within the logic of a serialization; it is anti-pattern to use indices to externally identify elements within an instance. Elements, by design, cannot be referenced "from the outside" - if you need to reference elements, you should add a UUID component to their type, or some other kind of identification scheme that fits your needs.

## examples

Given this schema

```tasl
namespace ex http://example.com/

class ex:Person {
  ex:age -> int
}

class ex:Person/name {
  ex:person -> * ex:Person
  ex:name -> string
}
```

we would encode this instance (given here in an informal JSON format)

```json
{
	"http://example.com/Person": [
		{ "http://example.com/age": 26 },
		{ "http://example.com/age": 25 }
	],
	"http://example.com/Person/name": [
		{
			"http://example.com/person": 0,
			"http://example.com/name": "Jim Halpert"
		},
		{
			"http://example.com/person": 1,
			"http://example.com/name": "Pam Beesly"
		},
		{
			"http://example.com/person": 1,
			"http://example.com/name": "Pamela Morgan Halpert"
		}
	]
}
```

as the byte array

```
010232580B4A696D2048616C70657274000A50616D20426565736C79011550616D656C61204D6F7267616E2048616C7065727401
```

... which is the concatenation of these parts:

1. `01` is the serialization version number
2. `02` is the number of elements in the `ex:Person` class
3. `32` is the signed varint for 25 (the product has only one component)
4. `58` is the signed varint for 44
5. `0B` the length of the string `Jim Halpert` (`http://example.com/name` lexicographically preceeds `http://example.com/person`)
6. `4A696D2048616C70657274` the content of the string `Jim Halpert`
7. `00` the index of the referenced `ex:Person` element
8. `0A` the length of the string `Pam Beesly`
9. `50616D20426565736C79` the content of the string `Pam Beesly`
10. `01` the index of the referenced `ex:Person` element
11. `15` the length of the string `Pamela Morgan Halpert`
12. `50616D656C61204D6F7267616E2048616C70657274` the content of the string `Pamela Morgan Halpert`
13. `01` the index of the referenced `ex:Person` element

This serialized instance is 104 bytes (compared to 423 bytes for the indented JSON version and 352 bytes for the JSON with all whitespace stripped).
