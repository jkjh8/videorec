import fs from 'fs'
import { Reader, Decoder, tools } from 'ts-ebml'

// import ffmpeg from 'fluent-ffmpeg'
// import ffmpegPath from 'ffmpeg-static'
// import ffprobePath from 'ffprobe-static'

// ffmpeg.setFfmpegPath(ffmpegPath)
// ffmpeg.setFfprobePath(ffprobePath.path)

export async function makeSeekable(args) {
  const decoder = new Decoder()
  const reader = new Reader()
  reader.drop_default_duration = false
  const webMBuf = fs.readFileSync(args.tempFile)
  const elms = decoder.decode(webMBuf)
  elms.forEach((elms) => {
    reader.read(elms)
  })
  reader.stop()
  const refinedMetadataBuf = tools.makeMetadataSeekable(
    reader.metadatas,
    args.duration,
    reader.cues
  )
  const body = webMBuf.slice(reader.metadataSize)
  fs.writeFileSync(
    args.fileFullPath,
    Buffer.concat([Buffer.from(refinedMetadataBuf), body])
  )

  // ffmpeg(args.fileFullPath).ffprobe((err, data) => {
  //   console.log(err, data)
  // })
}
