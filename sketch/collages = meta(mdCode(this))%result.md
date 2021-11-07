Our collage pipeline is a function that accepts a single parameter: the graph of
photos. This will either be fixed (whatever's on disk) or shuffled.

    {photos} = this/result:

For each photo folder, we create a "deck" of photos. Each deck is an array that we'll use as a queue, drawing from the top (front) of the deck array.

      decks = edgeArrays ${photos}

From each deck, we'll draw a hand of 4-6 photos. For folders with less than 4 photos, the hand will be empty (null).

      hands = map decks, drawHand

Read the EXIF metadata we care about

      exifData = map hands, exif

Come up with a good abstract layout for the photos

      layouts = map exifData, makeLayout

Transform the abstract layout to data necessary for rendering

      collages = map layouts, makeCollage

Add each folder's name and the photo date range to the collage so that we can show the information card alongside the collage

      result = addMetaData collages

Then we visit this graph. It's already in random order, so we can just do any traversal (e.g., depth-first). Each non-null value will be the complete data necessary to render the collage as HTML. (The empty hands represented by null values are ignored.)
