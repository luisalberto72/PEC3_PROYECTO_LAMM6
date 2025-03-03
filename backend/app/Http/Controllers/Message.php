<?php

namespace App\Http\Controllers;

use App\Events\chattevent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Broadcast;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Mail;


class Message extends Controller
{
    public function SendMessage(Request $request){
        Broadcast(new chattevent($request->message));
        return response()->json(['message'=>'messgae sent successfully'],Response::HTTP_OK);
    }
    public function sendEmail(Request $request)
    {
        $recipient = $request->input('recipient');
        $subject = $request->input('subject');
        $body = $request->input('body');

        try {
            Mail::raw($body, function ($message) use ($recipient, $subject) {
                $message->to($recipient)->subject($subject);
            });

            return response()->json(['message' => 'Email sent successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to send email', 'error' => $e->getMessage()], 500);
        }
    }
}
