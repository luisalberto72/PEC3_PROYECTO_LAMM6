<?php

namespace App\Http\Controllers;

use App\Models\Favourit;
use App\Models\User;
use App\Models\House;
use App\Models\FavouritTemprary;

use Illuminate\Http\Request;

class FavouritController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function AddFavourit(Request $request)
    {
        if($request->Perporty_id and $request->user_id){
            if(Favourit::where('Perporty_id',$request->Perporty_id)->where('user_id',$request->user_id)->exists()){
                return response()->json([
                    "message"=>"Favourite added successfully"
                ], 200);
            }elseif(User::where('id',$request->user_id)->exists() and House::where('id',$request->Perporty_id)->exists()){
                $post=new Favourit;
                $post->Perporty_id =$request->Perporty_id;
                $post->user_id =$request->user_id;
                $post->save();
                return response()->json([
                    "message"=>"Favourite added successfully"
                ], 200);
            }else{
                return response()->json([
                    "message"=>"Invalid Information"
                ], 404);
            }
            
        }else{
            return response()->json([
                "message"=>"Invalid Information"
            ], 404);
        }
            

    }
    public function UnFavourit($id)
    {
        if(Favourit::where('user_id',$id)->exists()){
            
            return response()->json([
                "message"=>"Favourite added successfully"
            ], 200);
            
        }else{
            return response()->json([
                "message"=>"Invalid Information"
            ], 404);
        }
            

    }
    public function Favouritforuser($id)
    {
        if (Favourit::where('user_id', $id)->exists()) {
            $favourites = Favourit::where('user_id', $id)->get();
            $array1 = [];
            foreach ($favourites as $favourite) {
                $array1[] = $favourite->Perporty_id;
            }
            $array2=[];
            foreach ($array1 as $Perporty_id) {
                $array2[] = House::find($Perporty_id);
                
            }
            
            return response()->json($array2);
        } else {
            return response()->json([
                "message" => "Invalid Information"
            ], 404);
        }
            

    }
    /**
     * Display the specified resource.
     */
    public function show(Favourit $favourit)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Favourit $favourit)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Favourit $favourit)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Favourit $favourit)
    {
        //
    }
}
