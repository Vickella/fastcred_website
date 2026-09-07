<?php
header('Content-Type: text/plain; charset=UTF-8');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit('Method not allowed'); }
function clean($v){ return trim(str_replace(["\r","\n"], ' ', (string)$v)); }
$to='info@fastcred.co.zw';
$name=clean($_POST['name'] ?? ''); $phone=clean($_POST['phone'] ?? ''); $email=clean($_POST['email'] ?? ''); $subject=clean($_POST['subject'] ?? 'Website enquiry'); $message=trim((string)($_POST['message'] ?? ''));
if(!$name || !$phone || !$subject || !$message){ http_response_code(422); exit('Missing required fields'); }
if($email && !filter_var($email,FILTER_VALIDATE_EMAIL)){ http_response_code(422); exit('Invalid email'); }
$body="Name: $name\nPhone: $phone\nEmail: $email\n\n$message";
$headers='From: FastCred Website <no-reply@fastcred.co.zw>' . "\r\n"; if($email) $headers.='Reply-To: '.$email."\r\n";
if(@mail($to,'FastCred Website: '.$subject,$body,$headers)) echo 'OK'; else { http_response_code(500); echo 'Mail service unavailable'; }
?>