export const initialValue = `# Welcome to the schema editor!
# If you're new, you probably want to read
# the schema language documentation here:
# https://tasl.io/docs

namespace ex http://example.com#

type foo {
  ex:a -> ? uri ;
  ex:b -> string ;
  ex:c -> dateTime ;
}

edge ex:cool ==/ ex:map /=> ex:wau

class ex:cool unit

class ex:wau {
  ex:bar -> foo ;
  ex:age -> integer ;
  ex:self -> * ex:wau ;
}






`
