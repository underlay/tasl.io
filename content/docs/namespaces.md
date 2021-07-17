# namespaces

tasl uses _terms_ from _namespaces_ to identify things.

Abstractly, a namespace is a vocabulary of URI terms. Namespaces are identified with a _namespace URI_, which is a URI that ends in an empty path segment (`/`) or an empty fragment (`#`). Generally we'll use "namespace" to refer both to the abstract vocabulary and its concrete URI. The terms in a namespace are URIs that begin with the namespace URI, and have one or more additional nonempty path segments or a nonempty fragment.

We use these URIs in tasl in four ways: to name classes, product components, coproduct options, and literal datatypes. We'll talk about datatypes in the next section, and just focus on the first two here. Don't worry too much about what "classes" and "properties" are exactly - for now, we're just using them casually to mean "things" and "attributes of things".

In order to use terms from a namespace in a tasl schema, we have to declare that namespace in the beginning of the schema like this:

```tasl
namespace s http://schema.org/
namespace ex http://example.com/ns#
namespace rdf http://www.w3.org/1999/02/22-rdf-syntax-ns#
```

"Declaring a namespace" means giving it a short, local prefix like `s`, `ex`, or `rdf`. When we actually use terms from the namespace, we'll always use this short prefix instead of the full base URI. For example, we'd write `s:Person` (which "expands" to `http://schema.org/Person`) or `ex:favoriteColor` (which "expands" to `http://example.com/ns#favoriteColor`), and so on. The prefixes that you give to namespaces are only scoped to each individual tasl file, and they can be whatever you want them to be, as long as they only consist of letters and numbers.

## using your own namespace

The easiest (and _safest_) way to get started writing schemas is to use your own namespace. You don't have to actually _do_ anything to "create a namespace" - you don't have to run a server, or publish it anywhere, or tell anybody. You can just pick a URL that you own and start using it:

```tasl
namespace hello http://my-own-domain.com/a/cool/namespace#

# The full name of this class is
# http://my-own-domain.com/a/cool/namespace#world
class hello:world {
  # ...
}
```

What _is_ important is that the base URI that you pick is actually _yours_. This typically means that it's a `http://` URL under a domain name that you own. This is important because the purpose of using URIs is to treat them as globally unique - so that people can leverage them as a decentralized coordination mechanism. A schema is mostly useful for modeling the specific dataset it's developed for, but the URIs also serve as an interface to the outside world (full of other schemas) that can enable all kinds of inter-schema use cases. This won't work if people start using the same URIs in different ways, so good practice is to only use URIs that you have the authority to use. This is never enforced - it's just part of the social contract of writing schemas.

Again, there doesn't have to _be_ anything at the URL `http://my-own-domain.com/a/cool/namespace#`. URLs are just the most convenient and accessible way for everyone to agree on who controls what namespace in a (relatively) decentralized fashion.

Some namespace naming tips:

- always use `http`; never use `https`
- use a domain name that you have authority over
- pick something that feels stable to you

## using terms from existing namespaces

There’s another way for people to agree on how to use a URI consistently - somebody can publish a vocabulary of terms with human-readable definitions, and then everybody can just follow that.

[schema.org](https://schema.org/) is an example of a public namespace like this. The full vocabulary is listed on [this webpage](https://schema.org/docs/full.html), and you can also find documentation about each of the terms like [`Person`](http://schema.org/Person), etc. This documentation is in the form of human-readable definitions:

- [`http://schema.org/Person`](http://schema.org/Person): _A person (alive, dead, undead, or fictional)._
- [`http://schema.org/name`](http://schema.org/name): _The name of the item._
- [`http://schema.org/knows`](http://schema.org/knows): _The most generic bi-directional social/work relation._

If the thing that you're modeling is a person (alive, dead, undead, or fictional), you should feel free to name your class `http://schema.org/Person`:

```tasl
namespace schema http://schema.org/

class schema:Person :: {
  schema:name -> string
}
```

Using terms from common, established vocabularies like schema.org makes your schema more machine-discoverable and machine-readable. But you should always be very careful about using terms accurately; when in doubt, just default something from your own namespace.
