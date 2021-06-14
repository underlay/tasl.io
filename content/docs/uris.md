# the URI type

In addition to literals, tasl schemas have a separate kind of primitive type for URIs. Here, we're not talking about the URIs that we use _in_ schemas to label classes, properties, and datatypes - we're talking about a simple, single type called "uri" that we use as a type for URI values in datasets. If you have a bunch of URI values in your dataset, you want to use the URI type in your schema.

The syntax for the uri type is an empty pair of angle brackets: `<>`

```tasl
namespace ex http://example.com/

class ex:Book :: {
  ex:title -> string
  ex:isbn -> <>
}
```

Alternatively, you might find `uri` more readable:

```tasl
namespace ex http://example.com/

class ex:Book :: {
  ex:title -> string
  ex:isbn -> uri
}
```

Just like `string` and `integer`, `uri` is defined to be global variable in tasl:

```tasl
type uri <>
```

Intuitively, we use the URI type for values that are _global identifiers_, like ISBN numbers, DOIs, database UUIDs, etc. In the same way that we use datatypes to coordinate at the schema/type level, we use URIs (ie URI values) to coordinate at the collection/value level. URIs are the way that a collection exposes identifiers to the world; they're the handles that we will use for matching, joining, co-identifying, etc. across collections.

Typically, when you use the URI type somewhere in a schema, you expect all of the values of that type to be a certain kind of URI - to all start with a certain prefix or all match some specific format. For now, there's no way to express this in tasl. All URIs are valid values for the URI type - but you should document what you expect with inline comments in the tasl file.

```tasl
namespace ex http://example.com/

class ex:Book :: {
  # These should be ISBN URNs, e.g. urn:isbn:0-486-27557-4
  ex:isbn -> <>
  ex:title -> string
}
```

_You should try to use URIs as much as you can_, even if you wouldn't immediately think of the value as a URI. Here are a few ways of URI-ifying things:

## specific URI schemes

The very first part of a URI is called the URI _scheme_. `http` is a URI scheme. `mailto` is a URI scheme. `file` is a URI scheme.

The official URI schemes are registered with IANA and listed [here](https://www.iana.org/assignments/uri-schemes/uri-schemes.xhtml). In practice, lots of people also use unofficial URI schemes that aren't registered. Wikipedia has a good summary of the official and some common unofficial schemes [here](https://en.wikipedia.org/wiki/List_of_URI_schemes).

If you're working with a kind of value that has a relatively commonly-used URI scheme of its own, you should use it! This applies to things like:

- Email addresses (`mailto:hello@example.com`)
- DOIs (`doi:10.1000/182`)
- Git repositories (`git://github.com/user/project-name.git`)
- Files on AWS S3 (`s3://mybucket/puppy.jpg`)
- Files on [IPFS](https://ipfs.io/) (`dweb:/ipfs/Qm...`)
- Blocks on [IPLD](https://docs.ipld.io/) (`dweb:/ipld/bafk...`)
- Bitcoin addresses (`bitcoin:...`)
- Magnet links (`magnet:...`)
- [Songs on Spotify](https://web.archive.org/web/20121120114317/http://www.spotify.com/uk/blog/archives/2008/01/14/linking-to-spotify/) (`spotify:...`)

These are all better modeled using the URI type than as literal string values (or as literals with some custom datatype).

```tasl
namespace ex http://example.com/

class ex:User :: {
  # mailto:...
  ex:email -> <>
  ex:username -> string
}

class ex:Repository :: {
  # git://...
  ex:id -> <>
  ex:owner -> * ex:User
}
```

## URNs

A [_URN_](https://en.wikipedia.org/wiki/Uniform_Resource_Name) is a URI that starts with `urn:` and then has one of [sixty officially registered namespaces](https://www.iana.org/assignments/urn-namespaces/urn-namespaces.xhtml) after it, each of which specifies the allowed syntax for the remaining URI components. For example, `isbn` is one of the registered URN namespaces, and its syntax looks like this `urn:isbn:0-486-27557-4`.

Most identifiers relating to standards bodies (ISO, IETF, etc) have URN namespaces. Do you have ISSNs in your schema? Use the URI type with [ISSN URN](https://www.iana.org/assignments/urn-formal/issn) values! ISANs? Got that too. Life science identifiers? Use LSID URNs. [OIDs](https://en.wikipedia.org/wiki/Object_identifier)? Use OID URNs. If the value you're modeling has a URN namespace, you should use it.

(Don't try to use URNs for DOIs. They're not officially registered as a URN namespace and and the `doi` URI scheme is more canonical.)

The most generally useful URN namespace is [`uuid`](https://tools.ietf.org/html/rfc4122). If you have [UUIDs](https://en.wikipedia.org/wiki/Universally_unique_identifier) in your data that you want to publish, use the URI type and format your values like this:

```
urn:uuid:3cf5a9a7-f6e5-4e83-ba0a-af88dc8360ab
```

Adding UUID ids is one of the easiest ways to give your class entities permanent external identity. We'll talk about this again later.

## URLs

[URLs](https://en.wikipedia.org/wiki/URL) are the most familiar kind of URI, since we use them for links on the web and see them displayed in our browsers all the time.

But using URIs in collections - even when they happen to be `http` URLs - is an entirely different thing, unrelated to the world wide web. URI values are just global identifiers; they aren't expected to be resolvable. Don't treat URIs (even `http` URLs) as links, and don't model links as URIs (more about this later). If you see a URL used as a URI value in a collection, you should never assume that there's actually a webpage there. Similarly, you should **never** just copy URLs from the internet to use as URI values. You should treat URIs that happen to be URLs the same way you treat URNs: they're just another global hierarchical namespace, except that URLs use [domain names](https://en.wikipedia.org/wiki/Domain_name) instead of the IANA registry.

It's a lot easier to register a domain name than it is to register a URN namespace or URI scheme with IANA, so URLs usually end up being the easiest way to make your own URIs. This is useful if you have some kind of internal identifiers, like numbers or short codes that you want to publish (if you're using UUIDs you can use the UUID URN namespace).

IMDB is a good example. Every movie in their database is identified by a short identifier (like `tt0492494`), and every actor is identified by a slightly different kind of identifier (like `nm1055413`). These show up in the URLs of the pages on their website, and also in their API and CSV exports. If IMDB was designing a schema for their dataset, they're probably want to include the IMDB id of each movie and actor, and the best way to do that is for them to come up with a URL format for them:

```tasl
namespace imdb http://imdb.com/

class imdb:Movie :: {
  # http://imdb.com/title/tt0492494
  imdb:id -> <>
  imdb:title -> string
  # ...
}

class imdb:Actor :: {
  # http://imdb.com/name/nm1055413
  imdb:id -> <>
  imdb:name -> string
  # ...
}
```

In this case, the URI values are very similar to what you'd see in your browser when you view a movie or actor on their website - but not exactly the same.

Please note that you should **not** invent URI formats for domains that you don't have authority over. Only IMDB has the authority to

Good URLs:

- always use `http` and never use `https`
- don't use `www.`
- don't have query strings (`?`)
- tend to have an alphanumeric id component
- are generally not human-readable
- are relatively permanent

If the URL has a page title, name, or is just a path like `http://example.com/folder1/folder2/file`, it's probably not a good URI value.

## what about actual URLs?

So if URLs in the "this links to a webpage" sense make bad URIs, how _should_ we model webpage links? This is obviously an extremely common kind of value!

The recommended way to model website URLs (that are meant to link to a webpage) is, oddly enough, as string literals. In the IMDB example, this would look like this:

```tasl
namespace imdb http://imdb.com/

class imdb:Movie :: {
  # http://imdb.com/title/tt0492494
  imdb:id -> <>

  # https://www.imdb.com/title/tt0492494
  imdb:url -> string

  imdb:title -> string
  # ...
}
```

Don't be afraid of the superficial redundancy here. The `imdb:id` and `imdb:url` properties serve different purposes, and it's good to be able to restructure the website and update URLs without having to change the ids that other people might be referencing.

## handling ambiguity

There will inevitably be situations where it's not clear whether some value should treated as a literal or a URI. And even in cases where a value is clearly some kind of identifier, there might be several plausible ways to represent it as a URI.

Corralling values into useful formats is often more art than science, and involves balancing different priorities that will never be in perfect harmony. You want your values to be as structured as possible without making them too hard to work with (and without pretending there's more structure than there really is). Make educated guesses, use the examples here as a general guide, and document your choices in your schema with inline comments.

## tl;dr

If you have _identifiers_ in some URI format, use the URI type. You write it like this: `<>`. If you want to make up your own URI format with a domain name that you control, go for it. Don't use URLs from websites as URIs. Don't expect URIs to be URLs, even if they start with `http://...`. It's good to use URIs as much as you can.
