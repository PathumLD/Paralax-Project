<?php

namespace App\Http\Middleware;

use Fideloper\Proxy\TrustProxies as Middleware;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\Middleware as ControllersMiddleware;

class TrustProxies extends ControllersMiddleware
{
    protected $proxies;
    protected $headers = Request::HEADER_X_FORWARDED_ALL;

    // Add any custom logic if necessary
}
