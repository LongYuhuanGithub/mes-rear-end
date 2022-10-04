use mes_rear_end;
show tables;

-- 用户表
drop table if exists sys_user;
create table sys_user(
    id bigint not null primary key auto_increment comment '用户ID',
    dept varchar(20) default null comment '部门',
    username varchar(30) default '' comment '用户名称',
    password varchar(255) default '' comment '密码',
    salt varchar(20) default '' comment '盐加密',
    user_type varchar(2) default '00' comment '用户类型（00系统用户 01注册用户）',
    email varchar(50) default '' comment '邮箱',
    phone varchar(11) default '' comment '手机号码',
    gender char(1) default '0' comment '用户性别（0男 1女 2未知）',
    status char(1) default '0' comment '帐号状态（0正常 1停用）',
    login_date datetime comment '最后登录时间',
    password_update_date datetime comment '密码最后更新时间',
    create_by varchar(64) default null comment '创建者',
    create_time datetime comment '创建时间',
    remark varchar(500) default null comment '备注',
    is_delete char(1) default 0 comment '删除标志（0代表存在 1代表删除）'
) engine=InnoDB default charset=utf8 comment = '用户信息表';
select * from sys_user;
select * from sys_user where is_delete = 0;
# select count(1) from sys_user where is_delete = 0 and (username = 'adminaaa' or email = '2630819701@qq.com' or phone = '17374000851aaa');
# select id, dept, username, user_type, email, phone, gender, status, login_date, password_update_date, create_by, create_time, remark from sys_user where is_delete = 0 and username like '%a%' and phone like '%1%' and status like '%0%' limit 0, 10;
insert into sys_user values(0, '市场部', 'admin', '123456', 'longyuhuan.com', '00', '2630819701@qq.com', '17374000851', '0', '0', now(), now(), 'admin', now(), '管理员', 0);
insert into sys_user values(0, '开发部', 'zhangsan', '123456', 'longyuhuan.com', '00', 'zhangsan@qq.com', '13200000000', '0', '0', now(), now(), 'admin', now(), '测试员', 0);
# update sys_user set password = '123456', password_update_date = now() where id = 1;
# update sys_user set is_delete = 1 where id = 1;
# update sys_user set login_date = now() where id = 1;

-- 角色表
drop table if exists sys_role;
create table sys_role(
    id bigint not null primary key auto_increment comment '角色ID',
    role_name varchar(30) not null comment '角色名称',
    sort int(4) not null comment '显示顺序',
    status char(1) not null comment '角色状态（0正常 1停用）',
    create_by varchar(64) default '' comment '创建者',
    create_time datetime comment '创建时间',
    remark varchar(500) default null comment '备注',
    is_delete char(1) default '0' comment '删除标志（0代表存在 2代表删除）'
) engine=InnoDB default charset=utf8 comment = '角色信息表';
select * from sys_role;
select * from sys_role where is_delete = 0;
select * from sys_role sr left join sys_user_role sur on sr.id = sur.role_id where is_delete = 0 and sur.user_id = 1;
select id, role_name, sort, status, create_by, create_time, remark from sys_role where is_delete = 0 and role_name like '%%';
insert into sys_role values(0, '超级管理员', 1, '0', 'admin', now(), '超级管理员', 0);
insert into sys_role values(0, '普通角色', 2, '0', 'admin', now(), '普通角色', 0);

-- 菜单表
drop table if exists sys_menu;
create table sys_menu(
    id bigint not null primary key auto_increment comment '菜单ID',
    menu_name varchar(50) not null comment '菜单名称',
    parent_id bigint default 0 comment '父菜单ID（0表示没有父级）',
    sort int(4) default 0 comment '显示顺序',
    url varchar(200) default '' comment '请求地址',
    menu_type char(1) default '' comment '菜单类型（M目录 C菜单 F按钮）',
    visible char(1) default 0 comment '菜单状态（0显示 1隐藏）',
    icon varchar(100) default 'menu' comment '菜单图标'
) engine=InnoDB default charset=utf8 comment = '菜单权限表';
select * from sys_menu;
# M目录
insert into sys_menu values(1, '首页', 0, 1, '', 'M', '0', 'icon-home-fill');
insert into sys_menu values(2, '系统管理', 0, 2, '', 'M', '0', 'icon-setting-fill');
insert into sys_menu values(3, '系统监控', 0, 3, '', 'M', '0', 'icon-video-fill');
# C菜单
insert into sys_menu values(4, '首页', 1, 1, '/home/welcome', 'C', '1', 'icon-appstore-fill');
insert into sys_menu values(5, '用户管理', 2, 1, '/home/users', 'C', '1', 'icon-appstore-fill');
insert into sys_menu values(6, '角色管理', 2, 2, '/home/roles', 'C', '1', 'icon-appstore-fill');
insert into sys_menu values(7, '菜单管理', 2, 3, '/home/menus', 'C', '1', 'icon-appstore-fill');
insert into sys_menu values(8, '部门管理', 2, 4, '/home/departments', 'C', '1', 'icon-appstore-fill');
insert into sys_menu values(9, '岗位管理', 2, 5, '/home/positions', 'C', '1', 'icon-appstore-fill');
insert into sys_menu values(10, '字典管理', 2, 6, '/home/dictionaries', 'C', '1', 'icon-appstore-fill');
insert into sys_menu values(11, '参数设置', 2, 7, '/home/parameters', 'C', '1', 'icon-appstore-fill');
insert into sys_menu values(12, '通知公告', 2, 8, '/home/notifications', 'C', '1', 'icon-appstore-fill');
insert into sys_menu values(13, '日志管理', 2, 9, '/home/logs', 'C', '1', 'icon-appstore-fill');
insert into sys_menu values(14, '数据视图', 3, 1, '/home/control', 'C', '1', 'icon-appstore-fill');
# F按钮
insert into sys_menu values(15, '添加用户', 4, 1, '/home/users/add', 'F', '0', 'icon-plus');
insert into sys_menu values(16, '修改用户', 4, 2, '/home/users/update', 'F', '0', 'icon-edit-square');
insert into sys_menu values(17, '删除用户', 4, 3, '/home/users/delete', 'F', '0', 'icon-close');

-- 用户和角色关系表
drop table if exists sys_user_role;
create table sys_user_role(
    user_id bigint not null comment '用户ID',
    foreign key(user_id) references sys_user(id) on delete cascade,
    role_id bigint not null comment '角色ID',
    foreign key(role_id) references sys_role(id) on delete cascade,
    primary key (user_id, role_id)
) engine=InnoDB default charset=utf8 comment='用户和角色关系表';
select * from sys_user_role;
insert into sys_user_role values(1, 1);
insert into sys_user_role values(2, 2);
# delete from sys_user_role where user_id = 3;


-- 角色和菜单关系表
drop table if exists sys_role_menu;
create table sys_role_menu(
    role_id bigint not null comment '角色ID',
    foreign key(role_id) references sys_role(id) on delete cascade,
    menu_id bigint not null comment '菜单ID',
    foreign key(role_id) references sys_menu(id) on delete cascade,
    primary key (role_id, menu_id)
) engine=InnoDB default charset=utf8 comment = '角色和菜单关联表';
select * from sys_role_menu;
insert into sys_role_menu values(1, 1);
insert into sys_role_menu values(1, 2);
insert into sys_role_menu values(1, 3);
insert into sys_role_menu values(1, 4);
insert into sys_role_menu values(1, 5);
insert into sys_role_menu values(1, 6);
insert into sys_role_menu values(1, 7);
insert into sys_role_menu values(1, 8);
insert into sys_role_menu values(1, 9);
insert into sys_role_menu values(1, 10);
insert into sys_role_menu values(1, 11);
insert into sys_role_menu values(1, 12);
insert into sys_role_menu values(1, 13);
insert into sys_role_menu values(1, 14);
insert into sys_role_menu values(1, 15);
insert into sys_role_menu values(1, 16);
insert into sys_role_menu values(1, 17);
