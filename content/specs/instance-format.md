# instance format

tasl instances can be serialized to binary files, canonically given the `.instance` file extension.

Instances and schemas are represented separately - `.instance` file does not contain the schema for the instance. In other words, given in-memory representation types `Schema` and `Instance`, serialization is always a function of two arguments:

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

class ex:Foo :: <>

class ex:Bar :: <>
```

... the elements in class `ex:Bar` would be serialized first, followed by the elements in `ex:Foo`.

Each serialized class begins with an unsigned varint encoding the total number of elements in the class (which may be zero). After this, each element is serialized consecutively; there are no delimiters between elements or between classes.

## values

Elements have no explicit identity or overhead; they are simply represented by serializing their _value_. Since the schema is known in advance, there is no need to _represent_ the types of each value in the serialization, since they are known from the schema.

### URIs

URI values begin with an unsigned varint encoding the length in bytes of the URI, followed by the bytes URI itself.

### literals

Since the datatype of the literal type is known from the schema, only the actual must be serialized.

The tasl `.instance` format can serialize values of arbitrary datatypes, since all values are represented as UTF-8 strings. Values are serialized with a uvarint length prefix followed by the raw bytes of the value.

**However** the tasl binary format has special cases for the following XSD datatypes:

```
| XSD datatype             | width (bytes) | serialization                                     |
| ------------------------ | ------------- | ------------------------------------------------- |
| `xsd:boolean`            | 1             | `1` for true or `0` for false                     |
| `xsd:double`             | 4             | IEEE float64                                      |
| `xsd:float`              | 2             | IEEE float32                                      |
| `xsd:integer`            | variable      | signed varint (Golang zig-zag encoding)           |
| `xsd:nonNegativeInteger` | variable      | unsigned varint (Golang encoding)                 |
| `xsd:long`               | 8             | int64                                             |
| `xsd:int`                | 4             | int32                                             |
| `xsd:short`              | 2             | int16                                             |
| `xsd:byte`               | 1             | int8                                              |
| `xsd:unsignedLong`       | 8             | uint64                                            |
| `xsd:unsignedInt`        | 4             | uint32                                            |
| `xsd:unsignedShort`      | 2             | uint16                                            |
| `xsd:unsignedByte`       | 1             | uint8                                             |
| `xsd:hexBinary`          | variable      | a uvarint length prefix followed by the raw bytes |
| `xsd:base64Binary`       | variable      | a uvarint length prefix followed by the raw bytes |
```

Note that `xsd:positiveInteger`, `xsd:nonPositiveInteger`, and `negativeInteger` do not have special encodings.

### products

Since the product components, their keys, and their values are all known in advance from the schema, a product value is serialized by serializing its component values by lexicographic order of their keys.

For example, in this schema

```tasl
namespace ex http://example.com/

class ex:Widget :: {
  ex:spinniness -> float
  ex:deluxe -> boolean
}
```

each `ex:Widget` element would be serialized by five bytes wide - first the `ex:deluxe` component, whose value (`boolean`) would take a fixed single byte, and then the `ex:deluxe` component, whose value (`float`) would take a fixed four bytes.

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

class ex:Person :: {
  ex:age -> integer
}

class ex:Person/name :: {
  ex:person -> * ex:Person
  ex:name -> string
}
```

we would encode this instance (given here in an unofficial JSON format)

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
0x010232580B4A696D2048616C70657274000A50616D20426565736C79011550616D656C61204D6F7267616E2048616C7065727401
```

... which is the concatenation of these parts:

1. `0x01` is the serialization version number
2. `0x02` is the number of elements in the `ex:Person` class
3. `0x32` is the signed varint for 25 (the product has only one component)
4. `0x58` is the signed varint for 44
5. `0x0B` the length of the string `Jim Halpert` (`http://example.com/name` lexicographically preceeds `http://example.com/person`)
6. `0x4A696D2048616C70657274` the content of the string `Jim Halpert`
7. `0x00` the index of the referenced `ex:Person` element
8. `0x0A` the length of the string `Pam Beesly`
9. `0x50616D20426565736C79` the content of the string `Pam Beesly`
10. `0x01` the index of the referenced `ex:Person` element
11. `0x15` the length of the string `Pamela Morgan Halpert`
12. `0x50616D656C61204D6F7267616E2048616C70657274` the content of the string `Pamela Morgan Halpert`
13. `0x01` the index of the referenced `ex:Person` element

This serialized instance is 104 bytes (compared to 423 bytes for the indented JSON version and 352 bytes for the JSON with all whitespace stripped).
