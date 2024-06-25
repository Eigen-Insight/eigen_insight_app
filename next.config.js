/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "l2beat.com" },
      { hostname: "s3.amazonaws.com" },
      { hostname: "raw.githubusercontent.com" },
      { hostname: "pbs.twimg.com" },
      { hostname: "cdn.stamp.fyi" },
      { hostname: "ltdfoto.ru" },
      { hostname: "cdn.discordapp.com" },
      { hostname: "i.ibb.co" },
      { hostname: "img.redbull.com" },
      { hostname: "www.google.com" },
      { hostname: "s3.hj" },
      { hostname: "gateway.lighthouse.storage" },
      { hostname: "static.tally.xyz" },
      { hostname: "ugc.production.linktr.ee" },
      { hostname: "i.imgur.com" },
      { hostname: "eigen-exlorer-avs.nyc3.cdn.digitaloceanspaces.com" },
      { hostname: "firebasestorage.googleapis.com" },
      { hostname: "othentic.mypinata.cloud" },
      { hostname: "yong-gie.github.io" },
      { hostname: "github.com" },
      { hostname: "wdmaster.top" },
      { hostname: "r.resimlink.com" },
      { hostname: "othentic.mypinata.cloud" },
      { hostname: "images.squarespace-cdn.com" },
      { hostname: "static.coinall.ltd" },
      { hostname: "raw.githubusercontent.com" },
      { hostname: "yong-gie.github.io" },
      { hostname: "www.coinhouse.com" },
      { hostname: "www.stakingcabin.com" },
      { hostname: "orig00.deviantart.net" },
      { hostname: "github.com" },
      { hostname: "lintns.github.io" },
      { hostname: "i.imgur.com" },
      { hostname: "www.pngall.com" },
      { hostname: "a41-official.github.io" },
      { hostname: "s3-eigenlayer-metadata.s3.amazonaws.com" },
      { hostname: "aethos-avs-metadata.s3.us-east-2.amazonaws.com" },
      { hostname: "i.ibb.co" },
      { hostname: "mainnet-ethereum-avs-metadata.s3.amazonaws.com"}
    ],
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
