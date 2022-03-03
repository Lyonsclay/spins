

curl "https://spinitron.com/WXOX/calendar-feed?start=2022-02-20T00:00:00&end=2022-02-27T06:59:59" \
| jq "." > "calendar.json"
