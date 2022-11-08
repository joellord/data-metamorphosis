concurrently --names "FollowerMonitor,Downloader,Greeter,Logger,BannerBuilder,ImageViewer" -c "red,blue,yellow,cyan,green,magenta" \
  "nodemon --watch ./followerMonitor ./followerMonitor" \
  "nodemon --watch ./downloader ./downloader" \
  "nodemon --watch ./greeter ./greeter" \
  "nodemon --watch ./logger ./logger" \
  "nodemon --watch ./bannerBuilder ./bannerBuilder" \
  "nodemon --watch ./imageViewer ./imageViewer"