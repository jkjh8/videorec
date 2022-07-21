import fs from 'fs'
import path from 'path'
import { homePath, currentPath, checkFolder } from '../index'
import {
  EbmlStreamDecoder,
  EbmlStreamEncoder,
  EbmlTagId
} from 'ebml-stream'
import { Transform } from 'stream'

const ebmlDecoder = new EbmlStreamDecoder({
  bufferTagIds: [EbmlTagId.TrackEntry]
})
const ebmlEncoder = new EbmlStreamEncoder()

let strippedTracks = {}

export function setTagFile(fileName) {
  fs.createReadStream(path.join(currentPath, fileName))
    .pipe(ebmlDecoder)
    .pipe(
      new Transform({
        transform(chunk, enc, cb) {
          console.log(chunk)
          if (chunk.id === EbmlTagId.TrackEntry) {
            if (
              chunk.Children.find((c) => c.id === EbmlTagId.TrackType)
                .data != 2
            ) {
              strippedTracks[
                chunk.Children.find(
                  (c) => c.id === EbmlTagId.TrackNumber
                ).data
              ] = true
              chunk = null
            }
          } else if (
            chunk.id === EbmlTagId.Block ||
            chunk.id === EbmlTagId.SimpleBlock
          ) {
            if (strippedTracks[chunk.track]) {
              chunk = null
            }
          }
          cb(null, chunk)
        },
        readableObjectMode: true,
        writableObjectMode: true
      })
    )
    .pipe(ebmlEncoder)
    .pipe(
      fs.createWriteStream(
        path.join(currentPath, `decoded_${fileName}`)
      )
    )
}
