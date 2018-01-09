<?php

$msg = "Email: " . $_GET['email'] . "\nSubject: " . $_GET['subject'] . "\nMessage: " . $_GET['message'] . "";
$msg = wordwrap($msg,70);
$subject = "AWGE Website Message :: " . $_GET['subject'] . "";

$mail=mail("miniwandco@gmail.com", $subject, $msg, $header);
$mail=mail("revengexstormtech@gmail.com", $subject, $msg, $header);
$mail=mail("robert@awgeshit.com", $subject, $msg, $header);
$mail=mail("support@SpecialDeliveryLA.com", $subject, $msg, $header);

?>