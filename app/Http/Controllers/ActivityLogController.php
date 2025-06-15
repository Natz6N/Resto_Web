<?php

namespace App\Http\Controllers;

use App\Models\activity_log;
use App\Http\Requests\Storeactivity_logRequest;
use App\Http\Requests\Updateactivity_logRequest;

class ActivityLogController extends Controller
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
    public function store(Storeactivity_logRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(activity_log $activity_log)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(activity_log $activity_log)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Updateactivity_logRequest $request, activity_log $activity_log)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(activity_log $activity_log)
    {
        //
    }
}
