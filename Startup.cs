namespace Aegir.Quote
{
    using Inda.Rp;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.ResponseCompression;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Hosting;
    using System.Linq;

    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
#if DEBUG
            services.AddIndaIdentity(new IndaOptions("ltank"));
            services.AddControllersWithViews().AddRazorRuntimeCompilation();
#else
            services.AddIndaIdentity(new IndaOptions("quote"));
            services.AddControllersWithViews();
#endif
            services.AddResponseCompression(o =>
            {
                o.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(
                    new[] { "application/octet-stream" });
            });
            services.AddResponseCaching();
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAll",
                    builder =>
                    {
                        builder
                        .AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader();
                    });
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseResponseCaching();
            app.UseResponseCompression();
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting();
            app.UseIndaIdentity();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Board}/{id?}");
            });
        }
    }
}
