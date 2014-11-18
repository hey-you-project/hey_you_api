conn = new Mongo();
db = conn.getDB("hey_you_db");

var dateOfExpire = Date.now() - 172800000;
var cursor = db.dots.find({'time' : {$lt: dateOfExpire} });
var beforeDotCount = db.dots.count();
var beforeExpiredDotCount = db.expired_dots.count();

print('');
print('===== Mongo Script for Archiving Expired Dots =====');
print('');
print('Before ============================================');
print(' Current # active dots: ' + beforeDotCount);
print('Current # expired dots: ' + beforeExpiredDotCount);
print('      Dots to transfer: ' + cursor.count());
print('===================================================');

print('Transfering . . .')
while ( cursor.hasNext() ) {
   db.expired_dots.insert(cursor.next());
   db.dots.remove(cursor.next());
}
print('');
print('After =============================================');
print(' Current # active dots: ' + db.dots.count());
print('Current # expired dots: ' + db.expired_dots.count());
print('     Removed from dots: '+ (db.dots.count() - beforeDotCount));
print(' Added to expired dots: '+ (db.expired_dots.count() + beforeExpiredDotCount));
print('===================================================');
