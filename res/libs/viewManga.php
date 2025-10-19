<?php
$uid = $_POST['uid'] ?? '';
$path = $_POST['path'] ?? '';

if (!$uid || !$path) exit("❌ Data tidak lengkap");

// Hilangkan karakter berbahaya agar nama folder aman
$path = str_replace(['..', '\\'], '', $path);

// Ubah ke path absolut dari lokasi script PHP ini
$fullPath = __DIR__ . '/../../' . $path; 
// karena viewManga.php ada di res/libs/, kita keluar dua folder untuk ke root proyek

if (!file_exists(dirname($fullPath))) {
    mkdir(dirname($fullPath), 0777, true); // auto bikin folder kalau belum ada
}

if (!file_exists($fullPath)) {
    file_put_contents($fullPath, "total_view=0\nuid_list=");
}

$content = file_get_contents($fullPath);
preg_match('/total_view=(\d+)/', $content, $m);
$total = isset($m[1]) ? intval($m[1]) : 0;
preg_match('/uid_list=(.*)/', $content, $m);
$uidList = isset($m[1]) && $m[1] ? explode(',', trim($m[1])) : [];

if (!in_array($uid, $uidList)) {
    $total++;
    $uidList[] = $uid;
    $newContent = "total_view={$total}\nuid_list=" . implode(',', $uidList);
    file_put_contents($fullPath, $newContent);
    echo "✅ View ditambah. Total: {$total}";
} else {
    echo "ℹ️ Sudah pernah baca, tidak menambah view.";
}
?>