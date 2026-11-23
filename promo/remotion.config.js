import { Config } from '@remotion/cli/config'

// Pakai folder public milik website supaya foto produk/pasar tidak diduplikasi.
Config.setPublicDir('../public')
Config.setVideoImageFormat('jpeg')
Config.setCodec('h264')
Config.setCrf(18)
