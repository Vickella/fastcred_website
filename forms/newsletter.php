<?php
header('Content-Type: text/plain; charset=UTF-8');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit('Method not allowed'); }
$email=trim((string)($_POST['email'] ?? ''));
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) { http_response_code(422); exit('Invalid email'); }
$to='info@fastcred.co.zw';
$headers="From: FastCred Website <no-reply@fastcred.co.zw>\r\nReply-To: $email\r\n";
if (@mail($to,'FastCred insights subscription',$email." requested FastCred updates.",$headers)) echo 'OK';
else { http_response_code(500); echo 'Mail service unavailable'; }
?>
