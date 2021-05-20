# namespaces

tasl schemas use _URIs_ from _namespaces_ to identify things.

We use URIs in tasl in three ways: to name classes, to name properties, and to identify datatypes. We'll talk about datatypes in the next section, and just focus on the first two here. Don't worry too much about what "classes" and "properties" are exactly - for now, we're just using them casually to mean "things" and "relationships between things".

A namespace is just a "base" URI that ends in `/` or `#`, like `http://schema.org/` or `http://example.com/hello/world#`. When we want to use terms from a namespace in a tasl schema, we have to declare that namespace in the beginning of the schema like this:

```tasl
# This is a tasl schema!
# Comments begin with `#`

namespace s http://schema.org/
namespace ex http://example.com/ns#
namespace rdf http://www.w3.org/1999/02/22-rdf-syntax-ns#
```

"Declaring a namespace" means giving it a short, local prefix - `s`, `ex`, and `rdf` in the example. When we actually use terms from the namespace, we'll always use this short prefix instead of the full base URI. For example, we'd write `s:Person` (which "expands" to `http://schema.org/Person`) or `ex:favoriteColor` (which "expands" to `http://example.com/ns#favoriteColor`), and so on. The prefixes that you give to namespaces are only scoped to each individual tasl file, and they can be whatever you want them to be, as long as they only consist of letters and numbers.

## using your own namespace

The easiest (and _safest_) way to get started writing schemas is to use your own namespace. You don't even have to actually _do_ anything to "create a namespace" - you don't have to run a server, or publish it anywhere, or tell anybody. You can just pick a URL that you own and start using it:

```tasl
namespace hello http://my-own-domain.com/a/cool/namespace#

# The full name of this class is
# http://my-own-domain.com/a/cool/namespace#world
class hello:world {
  # ...
}
```

What _is_ important is that the base URI that you pick is actually _yours_. This typically means that it's a `http://` URL under a domain name that you own. This is important because the purpose of using URIs is to treat them as globally unique - so that anyone who encounters the same URI in two different schemas can assume that they "mean" the same thing. A schemas is mostly useful for modeling the specific dataset it's developed for, but the URIs also serve as an interface to the outside world (full of other schemas) that can enable all kinds of inter-schema use cases. This won't work if people start using the same URIs in different ways, so good practice is to only use URIs that you have the authority to use. This is never enforced - it's just part of the social contract of writing schemas.

Again, there doesn't have to _be_ anything at the URL `http://my-own-domain.com/a/cool/namespace#`. None of the tools will try to look for anything there. URLs are just the most convenient and accessible way for everyone to agree on who controls what namespace in a (relatively) decentralized fashion.

Some namespace naming tips:

- always use `http`; never use `https`
- use a domain name that you have authority over
- pick something that feels stable to you

## using terms from existing namespaces

There’s another way for people to agree on how to use a URI consistently - somebody can create a namespace, list and document a vocabulary of terms in that namespace in a human-readable format, and then everybody can just follow that.

[schema.org](https://schema.org/) is an example of a public namespace like this. The full vocabulary is listed on [this webpage](https://schema.org/docs/full.html), and you can also find documentation about each of the terms like [`Person`](http://schema.org/Person), etc. This documentation is in the form of human-readable definitions:

- `http://schema.org/Person`: A person (alive, dead, undead, or fictional).
- `http://schema.org/name`: The name of the item.
- `http://schema.org/knows`: The most generic bi-directional social/work relation.

If the thing that you're modeling is a person (alive, dead, undead, or fictional), you should feel free to name your class `http://schema.org/Person`:

```tasl
namespace schema http://schema.org/

class schema:Person {
  schema:name -> string;
}
```

Using terms from common, established vocabularies like schema.org makes your schema more machine-discoverable and machine-readable. But you should always be very careful about using terms accurately; when in doubt, just default something from your own namespace.
