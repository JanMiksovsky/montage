# edgeArrays(graph)

Converts a graph of values to one in which interior nodes one step from the edge have their values placed in an array.

```yaml
fixture:
  a:
    key1: "a1"
    key2: "a2"
  b:
    key1: "b1"
    key2: "b2"
  c: "c1" # Will be dropped
actual = edgeArrays(fixture): ""
expected:
  a:
    - "a1"
    - "a2"
  b:
    - "b1"
    - "b2"
```
