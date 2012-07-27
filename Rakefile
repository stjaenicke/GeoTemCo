# Rakefile - create single combined nd compressed javascript file

COMPRESS="java -jar lib/yuicompressor-2.4.2.jar"
COMPRESSED_OUTPUT_FILE='geotemco-min.js'
OUTPUT_FILE='geotemco.js'
CSS_FILE='css/geotemco.css'

task :default => :all

task :all => [COMPRESSED_OUTPUT_FILE, OUTPUT_FILE, CSS_FILE]

# javascript sources
Files = %w(lib/jquery/jquery.min.js
js/Build/Minifier/basic.js
lib/excanvas/excanvas.js
js/Build/Minifier/simile-ajax-basic.js
lib/simile/ajax/scripts/platform.js
lib/simile/ajax/scripts/debug.js
lib/simile/ajax/scripts/xmlhttp.js
lib/simile/ajax/scripts/json.js
lib/simile/ajax/scripts/dom.js
lib/simile/ajax/scripts/graphics.js
lib/simile/ajax/scripts/date-time.js
lib/simile/ajax/scripts/string.js
lib/simile/ajax/scripts/html.js
lib/simile/ajax/scripts/data-structure.js
lib/simile/ajax/scripts/units.js
lib/simile/ajax/scripts/ajax.js
lib/simile/ajax/scripts/history.js
lib/simile/ajax/scripts/window-manager.js
js/Build/Minifier/timeline-basic.js
lib/simile/timeline/timeline-api.js
lib/simile/timeline/scripts/timeline.js
lib/simile/timeline/scripts/band.js
lib/simile/timeline/scripts/themes.js
lib/simile/timeline/scripts/ethers.js
lib/simile/timeline/scripts/ether-painters.js
lib/simile/timeline/scripts/event-utils.js
lib/simile/timeline/scripts/labellers.js
lib/simile/timeline/scripts/sources.js
lib/simile/timeline/scripts/original-painter.js
lib/simile/timeline/scripts/detailed-painter.js
lib/simile/timeline/scripts/overview-painter.js
lib/simile/timeline/scripts/compact-painter.js
lib/simile/timeline/scripts/decorators.js
lib/simile/timeline/scripts/units.js
lib/simile/timeline/scripts/l10n/en/timeline.js
lib/simile/timeline/scripts/l10n/en/labellers.js
js/Build/Minifier/timeplot-basic.js
lib/simile/timeplot/timeplot-api.js
lib/simile/timeplot/scripts/timeplot.js
lib/simile/timeplot/scripts/plot.js
lib/simile/timeplot/scripts/sources.js
lib/simile/timeplot/scripts/geometry.js
lib/simile/timeplot/scripts/color.js
lib/simile/timeplot/scripts/math.js
lib/simile/timeplot/scripts/processor.js
lib/slider/js/range.js
lib/slider/js/slider.js
lib/slider/js/timer.js
js/Time/SimileTimeplotModify.js
lib/openlayers/OpenLayers.js
js/Util/Tooltips.js
js/GeoTemConfig.js
js/Map/MapControl.js
js/Map/CircleObject.js
js/Util/FilterBar.js
js/Util/Selection.js
js/Map/PlacenameTags.js
js/Map/MapConfig.js
js/Map/MapGui.js
js/Map/MapWidget.js
js/Time/TimeConfig.js
js/Time/TimeGui.js
js/Time/TimeWidget.js
js/Table/TableConfig.js
js/Table/TableGui.js
js/Table/TableWidget.js
js/Table/Table.js
js/Util/DataObject.js
js/Util/Dataset.js
js/Time/TimeDataSource.js
js/Map/Binning.js
js/Map/MapDataSource.js
js/Map/Clustering.js
js/Util/Dropdown.js
js/Map/MapZoomSlider.js
js/Map/MapPopup.js
js/Map/PlacenamePopup.js
js/Util/Publisher.js
js/Util/WidgetWrapper.js
js/Build/Minifier/final.js)

# css sources
Cssfiles = %w(lib/simile/ajax/styles/graphics.css
lib/simile/timeline/styles/timeline.css
lib/simile/timeline/styles/ethers.css
lib/simile/timeline/styles/events.css
lib/simile/timeplot/styles/timeplot.css
css/style.css
lib/openlayers/theme/default/style.css)

def cat_files(outputfile, basename)
  File.open(outputfile, 'w') do |x|
    Files.each do |f|
      x.puts(File.open(f).read.gsub('REPLACEME-REPLACEME', basename))
    end
  end
end

file CSS_FILE => Cssfiles do
  File.open(CSS_FILE, 'w') do |x|
    Cssfiles.each do |f|
      x.puts(File.open(f).read)
    end
  end
end

# Just one big JS file, no compression.
file OUTPUT_FILE => Files do
  basename = File.basename(OUTPUT_FILE, ".js")
  cat_files(OUTPUT_FILE, basename)
end

# Compress it.
file COMPRESSED_OUTPUT_FILE => Files do
  basename = File.basename(COMPRESSED_OUTPUT_FILE, ".js")
  cat_files(OUTPUT_FILE, basename)
  system "#{COMPRESS} #{OUTPUT_FILE} >> #{COMPRESSED_OUTPUT_FILE}"
end

# Clean up the whole thing.
task :clean do
  rm OUTPUT_FILE
  rm COMPRESSED_OUTPUT_FILE
  rm CSS_FILE
end
