<?php
header('Content-Type: text/plain; charset=UTF-8');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit('Method not allowed'); }
function clean($v){ return trim(str_replace(["\r","\n"], ' ', (string)$v)); }
$to='info@fastcred.co.zw';
$loan=clean($_POST['loan_type'] ?? ''); $name=clean($_POST['name'] ?? ''); $phone=clean($_POST['phone'] ?? ''); $email=clean($_POST['email'] ?? ''); $location=clean($_POST['location'] ?? ''); $amount=clean($_POST['amount'] ?? ''); $purpose=trim((string)($_POST['purpose'] ?? '')); $consent=clean($_POST['consent'] ?? '');
if(!$loan || !$name || !$phone || !$location || !$purpose || $consent!=='yes'){ http_response_code(422); exit('Missing required fields'); }
if($email && !filter_var($email,FILTER_VALIDATE_EMAIL)){ http_response_code(422); exit('Invalid email'); }
$body="Loan type: $loan\nName: $name\nPhone: $phone\nEmail: $email\nLocation: $location\nRequested amount: $amount\nConsent: yes\n\nPurpose:\n$purpose";
$headers='From: FastCred Website <no-reply@fastcred.co.zw>' . "\r\n"; if($email) $headers.='Reply-To: '.$email."\r\n";
if(@mail($to,'FastCred Loan Enquiry: '.$loan.' - '.$name,$body,$headers)) echo 'OK'; else { http_response_code(500); echo 'Mail service unavailable'; }
?>