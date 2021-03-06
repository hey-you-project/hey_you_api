// Script to move expired dots out of the main dots collection
// over to an archive for the sake of quicker retrieval of dots.
// run in mango console with: load("lib/mongo_archive_script.js")
// or run from command line (cron job) with: mango /path/to/mango_archive_script.js

conn = new Mongo();
db = conn.getDB('hey_you_test');

var dateOfExpire = Date.now() - 12000;//172800000; //48hrs in ms
var cursor = db.dots.find({time: {$lt: dateOfExpire} });
var beforeDotCount = db.dots.count();
var beforeExpiredDotCount = db.expired_dots.count();

print(dateOfExpire);
print('===== Mongo Script for Archiving Expired Dots =====');
print('');
print('Before ============================================');
print(' Current # active dots: ' + beforeDotCount);
print('Current # expired dots: ' + beforeExpiredDotCount);
print('      Dots to transfer: ' + cursor.count());
print('===================================================');

if (cursor.count() > 1) {

  print('Transfering . . .');
  while (cursor.hasNext()) {
    db.expired_dots.insert(cursor.next());
    db.dots.remove(cursor.next());
  }
  print('');
  print('After =============================================');
  print(' Current # active dots: ' + db.dots.count());
  print('Current # expired dots: ' + db.expired_dots.count());
  print('     Removed from dots: ' + (beforeDotCount - db.dots.count()));
  print(' Added to expired dots: ' + (beforeExpiredDotCount - db.expired_dots.count()));
  print('===================================================');

} else {
  print('Nothing to transfer.');
}
