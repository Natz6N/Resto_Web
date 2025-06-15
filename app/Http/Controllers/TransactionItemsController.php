<?php

namespace App\Http\Controllers;

use App\Models\transaction_items;
use App\Http\Requests\Storetransaction_itemsRequest;
use App\Http\Requests\Updatetransaction_itemsRequest;

class TransactionItemsController extends Controller
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
    public function store(Storetransaction_itemsRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(transaction_items $transaction_items)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(transaction_items $transaction_items)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Updatetransaction_itemsRequest $request, transaction_items $transaction_items)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(transaction_items $transaction_items)
    {
        //
    }
}
